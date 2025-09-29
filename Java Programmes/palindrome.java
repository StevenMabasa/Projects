import java.util.Scanner;
import java.util.Vector;

public class palindrome {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            Vector<Integer> mylist = new Vector<Integer>();
            int num;
            int total;
            int duplicate;
            int reverse;
            int remainder;

            total = scanner.nextInt();
            //num = scanner.nextInt();//

            for (int j=0; j<total; j++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            for (int i=0; i<mylist.size(); i++) {
                duplicate = mylist.elementAt(i);
                reverse = 0;

                while (duplicate != 0) {
                    remainder = duplicate%10;
                    reverse = (reverse*10)+remainder;
                    duplicate /= 10;
                }

                if (i==mylist.size()-1 && reverse==mylist.elementAt(i)) {
                    System.out.println("1");
                }

                else if (reverse != mylist.elementAt(i)) {
                    System.out.println("0");
                    break;
                }

                else {
                    continue;
                }
            }
        }
    }
}