import java.util.Scanner;
import java.util.Vector;

public class digitcounter {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num = scanner.nextInt();
            int duplicate = num;
            int last_digit;

            Vector<Integer> divides = new Vector<Integer>();
            Vector<Integer> notdivides = new Vector<Integer>();

            while (duplicate > 0) {
                last_digit = duplicate%10;
                duplicate /= 10;         //removes last digit each time

                if (num%last_digit == 0) {
                    divides.add(last_digit);
                }

                else {
                    notdivides.add(last_digit);
                }
            }

            System.out.print("Divides :[ ");
            for (int i=divides.size()-1; i>=0; i--) {
                System.out.print(divides.elementAt(i));
                System.out.print(" ");
            }
            System.out.println("]");

            System.out.print("NotDivides :[ ");
            for (int j=notdivides.size()-1; j>=0; j--) {
                System.out.print(notdivides.elementAt(j));
                System.out.print(" ");
            }
            System.out.println("]");
        }
    }
}
