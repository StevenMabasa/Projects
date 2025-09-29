import java.util.Collections;
import java.util.Scanner;
import java.util.Vector;

public class median {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            Vector<Integer> mylist = new Vector<Integer>();
            int total = scanner.nextInt();
            int num;
            int num1;
            
            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            Collections.sort(mylist);      //sorting a vector in java

            if (total%2 == 0) {
                int num2;
                double median;
                num1 = total/2;
                num2 = num1 - 1;
                median = (double) (mylist.elementAt(num1)+mylist.elementAt(num2))/2;   //casting (look up if I forgot)
                System.out.println(median);
            }

            else {
                num1 = total/2;
                System.out.println(mylist.elementAt(num1));
            }
        }
    }
}
